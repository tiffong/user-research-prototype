from flask import Flask
from flask_cors import CORS
from flask import request
from flask import send_file
import tensorflow as tf
import numpy as np


app = Flask(__name__)
CORS(app)


meta_path = "model0815a/model.meta"
model_path = "./model0815a/"

row_num = 100
random_dim = 30
condition_dim = 9

# get data and save data as a dictionary
def parse_req():

    requestedData = request.get_json()

    print(requestedData)
    result = {}

    result["circle"] = requestedData["circle"]*2 - 1
    result["square"] = requestedData["square"]*2 - 1
    result["triangle"] = requestedData["triangle"]*2 - 1
    result["bright_dark"] = requestedData["bright_dark"]*2 - 1
    result["soft_sharp"] = requestedData["soft_sharp"]*2 - 1
    result["warm_cool"] = requestedData["warm_cool"]*2 - 1
    result["simple_complex"] = requestedData["simple_complex"]*2 - 1
    result["disorder_inorder"] = requestedData["disorder_inorder"]*2 - 1
    result["high_low"] = requestedData["high_low"]*2 - 1

    return result

def parse_req_1():

    requestedData = request.get_json()
    print(requestedData)

    result = {}

    result["circle"] = requestedData["circle"]*2 - 1
    result["square"] = requestedData["square"]*2 - 1
    result["triangle"] = requestedData["triangle"]*2 - 1
    result["bright_dark"] = requestedData["bright_dark"]*2 - 1
    result["soft_sharp"] = requestedData["soft_sharp"]*2 - 1
    result["warm_cool"] = requestedData["warm_cool"]*2 - 1
    result["simple_complex"] = requestedData["simple_complex"]*2 - 1
    result["disorder_inorder"] = requestedData["disorder_inorder"]*2 - 1
    result["high_low"] = requestedData["high_low"]*2 - 1

    # it depends on the type of data from front end
    # now it just for test on postman
    # result["random_noise"] = [float(x) for x in request.args.get("random_noise")[1:-1].split(",")]
    result["random_noise"] = requestedData["random_noise"]

    return result

@app.route("/test", methods = ["POST"])
def test():
    data = parse_req_1()
    print(data, type(data["random_noise"]))
    return str(type(data))

def parse_req_2():

    requestedData = request.get_json()
    print(requestedData)

    result = {}

    result["circle_1"] = requestedData["circle_1"]*2 - 1
    result["square_1"] = requestedData["square_1"]*2 - 1
    result["triangle_1"] = requestedData["triangle_1"]*2 - 1
    result["bright_dark_1"] = requestedData["bright_dark_1"]*2 - 1
    result["soft_sharp_1"] = requestedData["soft_sharp_1"]*2 - 1
    result["warm_cool_1"] = requestedData["warm_cool_1"]*2 - 1
    result["simple_complex_1"] = requestedData["simple_complex_1"]*2 - 1
    result["disorder_inorder_1"] = requestedData["disorder_inorder_1"]*2 - 1
    result["high_low_1"] = requestedData["high_low_1"]*2 - 1
    result["random_noise_1"] = requestedData["random_noise_1"]

    result["circle_2"] = requestedData["circle_2"]*2 - 1
    result["square_2"] = requestedData["square_2"]*2 - 1
    result["triangle_2"] = requestedData["triangle_2"]*2 - 1
    result["bright_dark_2"] = requestedData["bright_dark_2"]*2 - 1
    result["soft_sharp_2"] = requestedData["soft_sharp_2"]*2 - 1
    result["warm_cool_2"] = requestedData["warm_cool_2"]*2 - 1
    result["simple_complex_2"] = requestedData["simple_complex_2"]*2 - 1
    result["disorder_inorder_2"] = requestedData["disorder_inorder_2"]*2 - 1
    result["high_low_2"] = requestedData["high_low_2"]*2 - 1
    result["random_noise_2"] = requestedData["random_noise_2"]

    return result

@app.route("/sample_generator", methods = ["POST"])
def sample_generator():
        # get data
    data = parse_req()

    with tf.Session() as sess:
        # random input
        noise_input = np.random.uniform(-1, 1, size = (row_num, random_dim))
        # condition input
        condition_vector = []
        for k, v in data.items():
            condition_vector.append(v)
        condition_vector = np.array(condition_vector * row_num)
        condition_input = condition_vector.reshape(row_num, condition_dim)

        print(noise_input.shape)
        print(condition_input.shape)

        saver = tf.train.import_meta_graph(meta_path)
        model_file = tf.train.latest_checkpoint(model_path)
        saver.restore(sess, model_file)
        graph = tf.get_default_graph()
        g_output = graph.get_tensor_by_name("generator/outputs:0")
        noise_img = graph.get_tensor_by_name("noise_img:0")
        condition_img = graph.get_tensor_by_name("real_img_digit:0")

        img = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_input})
        np.savetxt("output_1.csv", img[:10], delimiter = ",", fmt = "%.10f")
        return send_file("output_1.csv")
        # the test output on postman
        # return str(img.shape)

@app.route("/img_generator", methods = ["POST"])
def img_generator():
    # get data
    data = parse_req()
    print(data)
    with tf.Session() as sess:
        # random input
        noise_input = np.random.uniform(-1, 1, size = (row_num, random_dim))
        # condition input
        condition_vector = []
        for k, v in data.items():
            condition_vector.append(v)
        condition_vector = np.array(condition_vector * row_num)
        condition_input = condition_vector.reshape(row_num, condition_dim)

        print(noise_input.shape)
        print(condition_input.shape)

        saver = tf.train.import_meta_graph(meta_path)
        model_file = tf.train.latest_checkpoint(model_path)
        saver.restore(sess, model_file)
        graph = tf.get_default_graph()
        g_output = graph.get_tensor_by_name("generator/outputs:0")
        noise_img = graph.get_tensor_by_name("noise_img:0")
        condition_img = graph.get_tensor_by_name("real_img_digit:0")

        img = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_input})
        #np.savetxt("output_2.csv", img, delimiter = ",")

        all_input = np.hstack((noise_input, condition_input))
        #np.savetxt("input_2.csv", all_input, delimiter = ",")

        output = np.hstack((all_input, img))
        np.savetxt("output_2.csv", output, delimiter = ",", fmt = "%.10f")

        return send_file("output_2.csv")
        # the test of output shape on postman
        # return str(output.shape)

@app.route("/img_augmentation", methods = ["POST"])
def img_augmentation():
    # get data including random_noise
    data = parse_req_1()
    print(data)

    with tf.Session() as sess:
        # random input
        noise_vector = data["random_noise"]
        noise_vector = np.array(noise_vector * row_num)
        noise_input = noise_vector.reshape(row_num, random_dim)
        # condition input
        condition_vector = []
        for k, v in data.items():
            condition_vector.append(v)
        condition_vector = np.array(condition_vector[:-1] * row_num)
        condition_input = condition_vector.reshape(row_num, condition_dim)

        print(noise_input.shape)
        print(condition_input.shape)

        saver = tf.train.import_meta_graph(meta_path)
        model_file = tf.train.latest_checkpoint(model_path)
        saver.restore(sess, model_file)
        graph = tf.get_default_graph()
        g_output = graph.get_tensor_by_name("generator/outputs:0")
        noise_img = graph.get_tensor_by_name("noise_img:0")
        condition_img = graph.get_tensor_by_name("real_img_digit:0")
        img = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_input})
        img = [img[0]]

        # condition_final_output
        condition_final_output = []

        # generate one picture for each change
        dim_change = [4, 3, 6, 7]
        # sharp1_soft0, index = 4
        lp = 6
        for i in range(lp):
            if i < 3:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][4] = condition_change[j][4] + (1 - condition_change[j][4])*(3-i) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))
            else:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][4] = condition_change[j][4] - (condition_change[j][4] - 0)*(i-2) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))

        # bright0_dark1, index = 3
        for i in range(lp):
            if i < 3:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][3] = condition_change[j][3] - (condition_change[j][3] - 0)*(3-i) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))
            else:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][3] = condition_change[j][3] + (1 - condition_change[j][3])*(i-2) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))

        # simple0_complex1, index = 6
        for i in range(lp):
            if i < 3:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][6] = condition_change[j][6] - (condition_change[j][6] - 0)*(3-i) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))
            else:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][6] = condition_change[j][6] + (1 - condition_change[j][6])*(i-2) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))

        # inorder1_disorder0, index = 7
        for i in range(lp):
            if i < 3:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][7] = condition_change[j][7] + (1 - condition_change[j][7])*(3-i) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))
            else:
                condition_change = condition_input
                for j in range(len(condition_change)):
                    condition_change[j][7] = condition_change[j][7] - (1 - condition_change[j][7])*(3-i) / 3
                condition_final_output.append(condition_change[0])
                pic = sess.run(g_output, feed_dict = {noise_img: noise_input, condition_img: condition_change})
                pic = [pic[0]]
                img = np.vstack((img, pic))

        img = img[1:]
        all_input = np.hstack((noise_input[:24], condition_final_output))
        output = np.hstack((all_input, img))
        np.savetxt("output_3.csv", output, delimiter = ",", fmt = "%.10f")
        return send_file("output_3.csv")

        # the test output on postman
        # return str(output.shape)

@app.route("/img_comparison", methods = ["POST"])
def img_comparison():
    # get data
    data = parse_req_2()
    print(data)

    with tf.Session() as sess:
        # random input
        noise_vector_1 = data["random_noise_1"]
        noise_vector_1 = np.array(noise_vector_1 * row_num)
        noise_input_1 = noise_vector_1.reshape(row_num, random_dim)

        noise_vector_2 = data["random_noise_2"]
        noise_vector_2 = np.array(noise_vector_2 * row_num)
        noise_input_2 = noise_vector_2.reshape(row_num, random_dim)

        # condition input
        condition_vector = []
        for k, v in data.items():
            condition_vector.append(v)

        condition_vector_1 = condition_vector[:9]
        condition_vector_1 = np.array(condition_vector_1 * row_num)
        condition_input_1 = condition_vector_1.reshape(row_num, condition_dim)

        condition_vector_2 = condition_vector[10:-1]
        condition_vector_2 = np.array(condition_vector_2 * row_num)
        condition_input_2 = condition_vector_2.reshape(row_num, condition_dim)


        saver = tf.train.import_meta_graph(meta_path)
        model_file = tf.train.latest_checkpoint(model_path)
        saver.restore(sess, model_file)
        graph = tf.get_default_graph()
        g_output = graph.get_tensor_by_name("generator/outputs:0")
        noise_img = graph.get_tensor_by_name("noise_img:0")
        condition_img = graph.get_tensor_by_name("real_img_digit:0")

        img_1 = sess.run(g_output, feed_dict = {noise_img: noise_input_1, condition_img: condition_input_1})
        img_1 = [img_1[0]]
        img_2 = sess.run(g_output, feed_dict = {noise_img: noise_input_2, condition_img: condition_input_2})
        img_2 = [img_2[0]]
        img = np.vstack((img_1, img_2))

        n_output = []
        c_output = []
        num_pic = 29
        noise_diff = (noise_input_2 - noise_input_1) / num_pic
        condition_diff = (condition_input_2 - condition_input_1) / num_pic
        for i in range(1, num_pic):
            n = noise_input_1 + noise_diff * i
            c = condition_input_1 + condition_diff * i
            n_output.append(n[0])
            c_output.append(c[0])
            pic = sess.run(g_output, feed_dict = {noise_img: n, condition_img: c})
            img = np.vstack((img, [pic[0]]))

        all_input = np.hstack((n_output, c_output))
        # we don not need the first two pictures
        output = np.hstack((all_input, img[2:]))
        np.savetxt("output_4.csv", output, delimiter = ",", fmt = '%.10f')
        return send_file("output_4.csv")
            
        # the test output on postman
        # return str(output.shape)
            
            
if __name__ == "__main__":
    app.run(debug = True)